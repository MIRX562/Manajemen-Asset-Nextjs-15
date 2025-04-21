"use server";
import prisma from "@/lib/db";
import { exportFile } from "../lib/sheet";
import * as z from "zod";
import { writeFile } from "fs/promises";

const assetReportSchema = z.object({
  from: z.date(),
  to: z.date(),
  status: z.string(),
  type: z.enum(["xlsx", "xls", "csv"]),
  items: z.array(z.string()).nonempty("You must select at least one field."),
});

export async function assetReport(data: z.infer<typeof assetReportSchema>) {
  try {
    const validatedData = assetReportSchema.parse(data);
    // Build the select object dynamically based on the items array
    const selectFields = validatedData.items.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    // Build the where clause dynamically based on the status
    const whereClause = {
      purchase_date: {
        gte: validatedData.from,
        lte: validatedData.to,
      },
      ...(validatedData.status !== "ALL" && { status: validatedData.status }),
    };

    // Fetch data based on the validated fields
    const reportData = await prisma.asset.findMany({
      where: whereClause,
      select: selectFields,
    });

    return reportData;
  } catch (error) {
    console.error("Error processing report:", error);
    return {
      success: false,
      message: error.message || "Failed to process report.",
    };
  }
}
