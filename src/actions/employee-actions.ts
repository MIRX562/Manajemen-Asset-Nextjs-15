"use server";

import prisma from "@/lib/db";
import {
  addEmployeeSchema,
  editEmployeeSchema,
} from "@/schemas/employee-schema";
import { Prisma, Employee } from "@prisma/client";
import { z } from "zod";
import { createActivityLog } from "./activities-actions";
import { getCurrentSession } from "@/lib/auth";

export const addEmployee = async (data: z.infer<typeof addEmployeeSchema>) => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const value = addEmployeeSchema.parse(data);

    // Check for unique constraints
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: value.email },
    });
    if (existingEmployee) {
      throw new Error("Email already in use");
    }

    const newEmployee = await prisma.employee.create({
      data: value,
    });

    createActivityLog({
      action: `Add new employee: ${newEmployee.name}`,
      target_type: "EMPLOYEE",
      target_id: newEmployee.id,
    });
    return newEmployee;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Unique constraint failed");
      }
    }
    throw new Error("Failed to add employee: " + error.message);
  }
};

export const editEmployee = async (
  data: z.infer<typeof editEmployeeSchema>
) => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const value = editEmployeeSchema.parse(data);

    const updatedEmployee = await prisma.employee.update({
      where: {
        id: value.id,
      },
      data: value,
    });

    createActivityLog({
      action: `Updated employee: ${updatedEmployee.name}`,
      target_type: "EMPLOYEE",
      target_id: updatedEmployee.id,
    });
    return updatedEmployee;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Employee not found");
      }
      if (error.code === "P2002") {
        throw new Error("Unique constraint failed");
      }
    }
    throw new Error("Failed to edit employee: " + error.message);
  }
};

export const deleteEmployee = async (data: Employee) => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    await prisma.employee.delete({
      where: {
        id: data.id,
      },
    });
    createActivityLog({
      action: `Deleted employee`,
      target_type: "EMPLOYEE",
      target_id: data.id,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Employee not found");
      }
    }
    throw new Error("Failed to delete employee: " + error.message);
  }
};

export const getAllEMployeesDropdown = async () => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return employees;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch asset");
  }
};

export const getEmployeeById = async (id: number) => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });
    if (!employee) {
      throw new Error("Employee not found!");
    }
    return employee;
  } catch (error) {
    console.error(error);
    throw new Error("failed to fetch data");
  }
};
