"use server";
import * as z from "zod";
import prisma from "@/lib/db";
import { AssetStatus, MaintenanceStatus } from "@prisma/client";
import { getCurrentSession } from "@/lib/auth";

const inventoryReportSchema = z.object({
  from: z.date(),
  to: z.date(),
  type: z.enum(["xlsx", "xls", "csv"]),
  items: z.array(z.string()).nonempty("You must select at least one field."),
});

export async function inventoryReport(
  data: z.infer<typeof inventoryReportSchema>
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const validatedData = inventoryReportSchema.parse(data);
    const selectFields = validatedData.items.reduce(
      (acc: Record<string, boolean>, field) => {
        acc[field] = true;
        return acc;
      },
      {}
    );

    const whereClause = {
      created_at: {
        gte: validatedData.from,
        lte: validatedData.to,
      },
    };

    const reportData = await prisma.inventory.findMany({
      where: whereClause,
      select: selectFields,
    });

    return reportData;
  } catch (error) {
    console.error("Error generating inventory report:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate inventory report.",
    };
  }
}

const assetReportSchema = z.object({
  from: z.date(),
  to: z.date(),
  status: z.nativeEnum(AssetStatus),
  type: z.enum(["xlsx", "xls", "csv"]),
  items: z.array(z.string()).nonempty("You must select at least one field."),
});

export async function assetReport(data: z.infer<typeof assetReportSchema>) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const validatedData = assetReportSchema.parse(data);
    const selectFields = validatedData.items.reduce(
      (acc: Record<string, boolean>, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    const whereClause = {
      purchase_date: {
        gte: validatedData.from,
        lte: validatedData.to,
      },
      ...(validatedData.status !== "ALL" && { status: validatedData.status }),
    };

    const reportData = await prisma.asset.findMany({
      where: whereClause,
      select: selectFields,
    });

    return reportData;
  } catch (error) {
    console.error("Error processing report:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to process report.",
    };
  }
}

const maintenanceReportSchema = z.object({
  from: z.date(),
  to: z.date(),
  status: z.nativeEnum(MaintenanceStatus),
  type: z.enum(["xlsx", "xls", "csv"]),
  items: z.array(z.string()).nonempty("You must select at least one field."),
});

export async function maintenanceReport(
  data: z.infer<typeof maintenanceReportSchema>
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const validatedData = maintenanceReportSchema.parse(data);
    const selectFields = validatedData.items.reduce(
      (acc: Record<string, boolean>, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    const whereClause = {
      scheduled_date: {
        gte: validatedData.from,
        lte: validatedData.to,
      },
      ...(validatedData.status !== "ALL" && { status: validatedData.status }),
    };

    const reportData = await prisma.maintenance.findMany({
      where: whereClause,
      select: selectFields,
    });

    return reportData;
  } catch (error) {
    console.error("Error generating maintenance report:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate maintenance report.",
    };
  }
}
