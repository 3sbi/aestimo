import "server-only";

import { config } from "@/server/config";
import type { Room, User } from "@/types";
import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

interface SessionData {
  userId?: User["id"];
  roomSlug?: Room["slug"];
}

const sessionOptions: SessionOptions = {
  password: config.sessionSecret,
  cookieName: "session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const getSession = async (): Promise<IronSession<SessionData>> => {
  const cookiesStore = await cookies();
  return getIronSession(cookiesStore, sessionOptions);
};
