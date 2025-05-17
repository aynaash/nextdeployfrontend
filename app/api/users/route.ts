import { NextResponse } from 'next/server';
import { db } from '../../../lib/db.ts';
import { users } from "../../../drizzle/schema.ts";
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    let query = db.select().from(users);
    
    if (email) {
      query = query.where(eq(users.email, email));
    }
    
    const allUsers = await query;
    return NextResponse.json(allUsers);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { users: userData, accounts: accountData, sessions: sessionData,
      verification_tokens: vtData, authenticators: authData, user_accounts: uaData } = body;

    const [newUser] = await db.insert(users).values(userData).returning();
    const [newAccount] = await db.insert(accounts).values(accountData).returning();
    const [newSession] = await db.insert(sessions).values(sessionData).returning();
    const [newVT] = await db.insert(verification_tokens).values(vtData).returning();
    const [newAuth] = await db.insert(authenticators).values(authData).returning();
    const [newUA] = await db.insert(user_accounts).values(uaData).returning();

    return NextResponse.json({
      user: newUser,
      account: newAccount,
      session: newSession,
      verification_token: newVT,
      authenticator: newAuth,
      user_account: newUA
    }, { status: 201 });

  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
