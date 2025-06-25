// File: src/state/api.ts

import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import {
  Application,
  Lease,
  Manager,
  Payment,
  Property,
  Tenant,
} from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Amplify } from "aws-amplify";
import awsExports from "@/aws-exports";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { FiltersState } from ".";

Amplify.configure(awsExports);

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Managers",
    "Tenants",
    "Properties",
    "PropertyDetails",
    "Leases",
    "Payments",
    "Applications",
    "Notifications",
  ],
  endpoints: (build) => ({
    /* Authentication & User Endpoints */
    getAuthUser: build.query<any, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          const endpoint =
            userRole === "manager"
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;

          let response = await fetchWithBQ(endpoint);
          if (response.error && response.error.status === 404) {
            response = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              fetchWithBQ
            );
          }
          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: response.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),

    /* Property Endpoints */
    getProperties: build.query<
      Property[],
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });
        return { url: "properties", params };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to fetch properties.",
        });
      },
    }),

    getProperty: build.query<Property, number>({
      query: (id) => `properties/${id}`,
      providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to load property details.",
        });
      },
    }),

    createProperty: build.mutation<Property, FormData>({
      query: (newProperty) => ({
        url: "properties",
        method: "POST",
        body: newProperty,
      }),
      invalidatesTags: (result) => [
        { type: "Properties", id: "LIST" },
        { type: "Managers", id: result?.manager?.id },
      ],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Property created successfully!",
          error: "Failed to create property.",
        });
      },
    }),

    /* Tenant Endpoints */
    getTenant: build.query<Tenant, string>({
      query: (cognitoId) => `tenants/${cognitoId}`,
      providesTags: (result) => [{ type: "Tenants", id: result?.id }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to load tenant profile.",
        });
      },
    }),

    getAllTenants: build.query<Tenant[], void>({
      query: () => `tenants`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((t) => ({ type: "Tenants" as const, id: t.id })),
              { type: "Tenants", id: "LIST" },
            ]
          : [{ type: "Tenants", id: "LIST" }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, { error: "Failed to fetch tenants." });
      },
    }),

    updateTenantSettings: build.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...updates }) => ({
        url: `tenants/${cognitoId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    suspendTenant: build.mutation<
      { cognitoId: string; isSuspended: boolean },
      { cognitoId: string; isSuspended: boolean }
    >({
      query: ({ cognitoId, isSuspended }) => ({
        url: `tenants/${cognitoId}/suspend`,
        method: "PUT",
        body: { isSuspended },
      }),
      // invalidate the LIST so getAllTenants auto-refetches
      invalidatesTags: [{ type: "Tenants", id: "LIST" }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "User suspension updated",
          error: "Failed to update user suspension",
        });
      },
    }),

    addFavoriteProperty: build.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Added to favorites!",
          error: "Failed to add to favorites.",
        });
      },
    }),

    removeFavoriteProperty: build.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Removed from favorites!",
          error: "Failed to remove from favorites.",
        });
      },
    }),

    getCurrentResidences: build.query<Property[], string>({
      query: (cognitoId) => `tenants/${cognitoId}/current-residences`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to fetch current residences.",
        });
      },
    }),

    getPropertyGrowthPerDay: build.query<
      { day: string; count: number }[],
      void
    >({
      async queryFn(_, _queryApi, _extraOptions, fetchWithBQ) {
        // fetch all properties
        const res = await fetchWithBQ("properties?limit=10000");
        if (res.error) return { error: res.error as any };
        const props = res.data as Property[];
        // group by postedDate day
        const map: Record<string, number> = {};
        props.forEach((p) => {
          const d = new Date(p.postedDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          map[d] = (map[d] || 0) + 1;
        });
        const arr = Object.entries(map).map(([day, count]) => ({ day, count }));
        return { data: arr };
      },
      providesTags: ["Properties"],
    }),

    getPropertyCountsByType: build.query<
      { propertyType: string; count: number }[],
      void
    >({
      async queryFn(_, _queryApi, _extraOptions, fetchWithBQ) {
        const res = await fetchWithBQ("properties?limit=10000");
        if (res.error) return { error: res.error as any };
        const props = res.data as Property[];
        const map: Record<string, number> = {};
        props.forEach((p) => {
          map[p.propertyType] = (map[p.propertyType] || 0) + 1;
        });
        const arr = Object.entries(map).map(([propertyType, count]) => ({
          propertyType,
          count,
        }));
        return { data: arr };
      },
      providesTags: ["Properties"],
    }),

    /* Manager Endpoints */
    getManagerProperties: build.query<Property[], string>({
      query: (cognitoId) => `managers/${cognitoId}/properties`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to load manager properties.",
        });
      },
    }),

    updateManagerSettings: build.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...updates }) => ({
        url: `managers/${cognitoId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    /* Lease & Payment Endpoints */
    getLeases: build.query<Lease[], void>({
      query: () => "leases",
      providesTags: ["Leases"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, { error: "Failed to fetch leases." });
      },
    }),
    getPropertyLeases: build.query<Lease[], number>({
      query: (id) => `properties/${id}/leases`,
      providesTags: ["Leases"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to fetch property leases.",
        });
      },
    }),
    createPayment: build.mutation<
      Payment,
      {
        leaseId: number;
        amountDue: number;
        amountPaid: number;
        dueDate: string;
        paymentDate: string;
      }
    >({
      query: (body) => ({ url: "payments", method: "POST", body }),
      invalidatesTags: ["Payments", "Leases"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Payment submitted successfully!",
          error: "Failed to submit payment.",
        });
      },
    }),
    getTenantPayments: build.query<Payment[], string>({
      query: (cognitoId) => `payments/tenant/${cognitoId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Payments" as const, id: p.id })),
              { type: "Payments", id: "LIST" },
            ]
          : [{ type: "Payments", id: "LIST" }],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to fetch payment history.",
        });
      },
    }),
    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to fetch payment info.",
        });
      },
    }),
    getUserMessages: build.query<Notification[], void>({
      query: () => `notifications/messages`,
      providesTags: (result) =>
        result
          ? result.map((msg) => ({
              type: "Notifications" as const,
              id: msg.id,
            }))
          : [],
    }),
    getUserAlerts: build.query<Notification[], void>({
      query: () => `notifications/alerts`,
      providesTags: (result) =>
        result
          ? result.map((alert) => ({
              type: "Notifications" as const,
              id: alert.id,
            }))
          : [],
    }),

    /* Application Endpoints */
    getApplications: build.query<
      Application[],
      { userId?: string; userType?: string }
    >({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params.userId) qp.append("userId", params.userId);
        if (params.userType) qp.append("userType", params.userType);
        return `applications?${qp.toString()}`;
      },
      providesTags: ["Applications"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          error: "Failed to fetch applications.",
        });
      },
    }),
    updateApplicationStatus: build.mutation<
      Application & { lease?: Lease },
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `applications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Applications", "Leases", "Payments"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Application status updated!",
          error: "Failed to update status.",
        });
      },
    }),
    createApplication: build.mutation<Application, Partial<Application>>({
      query: (body) => ({ url: "applications", method: "POST", body }),
      invalidatesTags: ["Applications"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Application created successfully!",
          error: "Failed to create application.",
        });
      },
    }),

    /* Email Notification Endpoints */
    sendEmailToAll: build.mutation<void, { subject: string; message: string }>({
      query: (body) => ({
        url: "notifications/email/all",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Email sent to all users!",
          error: "Failed to send email to all users.",
        });
      },
    }),
    sendEmailToUser: build.mutation<
      void,
      { email: string; subject: string; message: string }
    >({
      query: ({ email, subject, message }) => ({
        url: "notifications/email/user",
        method: "POST",
        body: { email, subject, message },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Email sent to user!",
          error: "Failed to send email to user.",
        });
      },
    }),

    /* New Profile Update Notification Endpoint */
    sendProfileUpdateEmail: build.mutation<
      void,
      { email: string; updatedFields: string[] }
    >({
      query: ({ email, updatedFields }) => ({
        url: "notifications/email/profile-update",
        method: "POST",
        body: { email, updatedFields },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await withToast(queryFulfilled, {
          success: "Profile update notification sent!",
          error: "Failed to send profile update notification.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetAllTenantsQuery,
  useGetPropertyQuery,
  useGetPropertyGrowthPerDayQuery,
  useGetPropertyCountsByTypeQuery,
  useSuspendTenantMutation,
  useCreatePropertyMutation,
  useGetTenantQuery,
  useGetUserMessagesQuery,
  useGetUserAlertsQuery,
  useUpdateTenantSettingsMutation,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetCurrentResidencesQuery,
  useGetManagerPropertiesQuery,
  useUpdateManagerSettingsMutation,
  useGetPropertyLeasesQuery,
  useCreatePaymentMutation,
  useGetTenantPaymentsQuery,
  useGetPaymentsQuery,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
  useSendEmailToAllMutation,
  useSendEmailToUserMutation,
  useSendProfileUpdateEmailMutation,
} = api;
