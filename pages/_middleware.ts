import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    const cookie = req.cookies
    console.log(cookie)
    return new Response("test")
  }