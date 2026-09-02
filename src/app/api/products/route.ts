import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Product from "../../../models/Product";
import { errorResponse, readBody } from "../../../lib/routeHelpers";
export async function GET() { try { await dbConnect(); return NextResponse.json(await Product.find().sort({ createdAt: -1 }).lean()); } catch (error) { return errorResponse(error, "Failed to load products."); } }
export async function POST(request: Request) { try { const data = await readBody(request); if (!data.name || !data.description || !data.category) return NextResponse.json({ error: "Name, description, and category are required." }, { status: 400 }); await dbConnect(); return NextResponse.json(await Product.create({ ...data, images: (data.images as string[] | undefined) ?? [] }), { status: 201 }); } catch (error) { return errorResponse(error, "Failed to create product."); } }
