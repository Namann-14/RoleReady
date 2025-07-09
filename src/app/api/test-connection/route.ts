import { NextResponse } from 'next/server';
import { ConnectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log("Testing MongoDB connection...");
    const connection: any = await ConnectToDatabase();
    
    return NextResponse.json({ 
      success: true,
      message: "Database connected successfully",
      readyState: connection.connection.readyState,
      host: connection.connection.host,
      name: connection.connection.name
    });
  } catch (error: any) {
    console.error("Database connection test failed:", error);
    
    return NextResponse.json({
      success: false,
      error: "Database connection failed",
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}