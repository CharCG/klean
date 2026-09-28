import { z } from 'zod';
import { reportSchema } from '@/features/report/model/report.schemas';
import { reviewSchema } from '@/features/review/model/review.schemas';
import { serviceSchema } from '@/features/service/model/service.schemas';

export const orderStatusSchema = z.enum(['CREATED', 'PROCESSING', 'FINISHED', 'COMPLETED', 'FAILED']);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const fulfillmentTypeSchema = z.enum(['DELIVERY', 'PICKUP']);
export type FulfillmentType = z.infer<typeof fulfillmentTypeSchema>;

export const paymentStatusSchema = z.enum(['PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED']);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  serviceId: z.string(),
});

export const paymentSchema = z.object({
  id: z.string().optional(),
  snapToken: z.string().nullish().transform((value) => value ?? undefined),
  snapRedirectUrl: z.string().nullish().transform((value) => value ?? undefined),
  transactionId: z.string().nullish().transform((value) => value ?? undefined),
  status: paymentStatusSchema,
  amount: z.number().optional(),
  paidAt: z.string().nullish().transform((value) => value ?? undefined),
  expiredAt: z.string().nullish().transform((value) => value ?? undefined),
  orderId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const orderSchema = z.object({
  id: z.string(),
  total: z.number(),
  status: orderStatusSchema,
  estimationTime: z.string(),
  fulfillment: fulfillmentTypeSchema,
  notes: z.string().nullish().transform((value) => value ?? undefined),
  customerId: z.string(),
  merchantId: z.string(),
  items: z.array(orderItemSchema),
  payment: paymentSchema.nullish().transform((value) => value ?? undefined),
  review: reviewSchema.nullish().transform((value) => value ?? undefined),
  report: reportSchema.nullish().transform((value) => value ?? undefined),
  merchant: z.object({
    id: z.string().optional(),
    name: z.string(),
    logoUrl: z.string().nullish().transform((value) => value ?? undefined),
  }).nullish().transform((value) => value ?? undefined),
  customer: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    address: z.string().nullish().transform((value) => value ?? ''),
  }).nullish().transform((value) => value ?? undefined),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Order = z.infer<typeof orderSchema>;

export const updatedOrderSchema = orderSchema.pick({
  id: true,
  total: true,
  status: true,
  estimationTime: true,
  fulfillment: true,
  notes: true,
  customerId: true,
  merchantId: true,
  createdAt: true,
  updatedAt: true,
});

export const createOrderPayloadSchema = z.object({
  merchantId: z.string(),
  fulfillment: fulfillmentTypeSchema,
  notes: z.string().optional(),
  items: z.array(z.object({ serviceId: z.string(), quantity: z.number().int().positive() })).min(1),
});
export type CreateOrderPayload = z.infer<typeof createOrderPayloadSchema>;

export const cartItemSchema = serviceSchema.extend({
  merchantId: z.string(),
  merchantName: z.string(),
  qty: z.number().int().positive(),
});
export type CartItem = z.infer<typeof cartItemSchema>;

export const checkoutStateSchema = z.object({
  cart: z.array(cartItemSchema).min(1),
  merchantId: z.string(),
  merchantName: z.string(),
});
