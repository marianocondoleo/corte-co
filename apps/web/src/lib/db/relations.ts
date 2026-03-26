import { relations } from "drizzle-orm";
import {
  users,
  products,
  solicitudes,
  solicitudFiles,
  solicitudStatusHistory,
  addresses,
  payments,
} from "./schema";

// 👤 USERS
export const usersRelations = relations(users, ({ many }) => ({
  solicitudes: many(solicitudes),
  addresses: many(addresses),
  payments: many(payments),
}));

// 📦 PRODUCTS
export const productsRelations = relations(products, ({ many }) => ({
  solicitudes: many(solicitudes),
}));

// 📋 SOLICITUDES
export const solicitudesRelations = relations(solicitudes, ({ one, many }) => ({
  user: one(users, {
    fields: [solicitudes.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [solicitudes.productId],
    references: [products.id],
  }),
  files: many(solicitudFiles),
  statusHistory: many(solicitudStatusHistory),
  payments: many(payments),
}));

// 📄 SOLICITUD FILES
export const solicitudFilesRelations = relations(
  solicitudFiles,
  ({ one }) => ({
    solicitud: one(solicitudes, {
      fields: [solicitudFiles.solicitudId],
      references: [solicitudes.id],
    }),
  })
);

// 📊 SOLICITUD STATUS HISTORY
export const solicitudStatusHistoryRelations = relations(
  solicitudStatusHistory,
  ({ one }) => ({
    solicitud: one(solicitudes, {
      fields: [solicitudStatusHistory.solicitudId],
      references: [solicitudes.id],
    }),
  })
);

// 🏠 ADDRESSES
export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

// 💳 PAYMENTS
export const paymentsRelations = relations(payments, ({ one }) => ({
  solicitud: one(solicitudes, {
    fields: [payments.solicitudId],
    references: [solicitudes.id],
  }),
}));
