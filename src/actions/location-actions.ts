"use server";
import prisma from "@/lib/db";
import { Location, LocationType } from "@prisma/client";
import { createActivityLog } from "./activities-actions";

// Create a new location
export async function createLocation(data: {
  name: string;
  address: string;
  type: LocationType;
}) {
  try {
    const newLocation = await prisma.location.create({ data });
    createActivityLog({
      action: `Add new location : ${newLocation.name}`,
      target_type: "LOCATION",
      target_id: newLocation.id,
    });
    return { success: true, message: "Location successfully added" };
  } catch (error) {
    console.error("[createLocation] Failed to create location:", error);
    throw new Error("Failed to create location. Please try again.");
  }
}

// Update a location
export async function updateLocation(data: {
  name?: string;
  address?: string;
  type?: LocationType;
  id: number;
}) {
  try {
    const updated = await prisma.location.update({
      where: { id: data.id },
      data,
    });
    createActivityLog({
      action: `Updated location : ${updated.name}`,
      target_type: "LOCATION",
      target_id: updated.id,
    });
    return { success: true, message: "Location successfully added" };
  } catch (error) {
    console.error(
      `[updateLocation] Failed to update location with ID ${data.id}:`,
      error
    );
    throw new Error("Failed to update the location. Please try again.");
  }
}

// Delete a location
export async function deleteLocation(data: Location) {
  try {
    await prisma.location.delete({
      where: { id: data.id },
    });
    createActivityLog({
      action: `Updated location : ${data.name}`,
      target_type: "LOCATION",
      target_id: data.id,
    });
    return { success: true, message: "Location successfully added" };
  } catch (error) {
    console.error(
      `[deleteLocation] Failed to delete location with ID ${data.id}:`,
      error
    );
    throw new Error("Failed to delete the location. Please try again.");
  }
}

// Get all locations
export async function getAllLocations() {
  try {
    return await prisma.location.findMany();
  } catch (error) {
    console.error("[getAllLocations] Failed to retrieve locations:", error);
    throw new Error("Failed to retrieve locations. Please try again.");
  }
}

// Get a single location by ID
export async function getLocationById(id: number) {
  try {
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        locationHistory: {
          include: {
            asset: {
              select: {
                name: true,
              },
            },
          },
        },
        inventories: {
          select: {
            name: true,
            quantity: true,
          },
        },
      },
    });
    if (!location) {
      throw new Error(`No location found with ID: ${id}`);
    }
    return location;
  } catch (error) {
    console.error(
      `[getLocationById] Failed to retrieve location with ID ${id}:`,
      error
    );
    throw new Error("Failed to retrieve the location. Please try again.");
  }
}

// Get all locations by type
export async function getLocationsByType(
  type: "GUDANG" | "KANTOR" | "DATA_CENTER"
) {
  try {
    return await prisma.location.findMany({
      where: { type },
    });
  } catch (error) {
    console.error(
      `[getLocationsByType] Failed to retrieve locations of type ${type}:`,
      error
    );
    throw new Error("Failed to retrieve locations by type. Please try again.");
  }
}
