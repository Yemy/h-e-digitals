declare module 'next-auth' {
  export function getServerSession(...args: any[]): any;
  export type NextAuthOptions = any;
  export type NextAuthUser = any;
  const _default: any;
  export default _default;
}

declare module 'next-auth/middleware' {
  export const withAuth: any;
}

declare module 'next-auth/react' {
  export function getSession(...args: any[]): any;
  export function signIn(...args: any[]): any;
  export function signOut(...args: any[]): any;
  export function useSession(...args: any[]): any;
  export const SessionProvider: any;
}

declare module 'next-auth/providers' {
  const _any: any;
  export default _any;
}
