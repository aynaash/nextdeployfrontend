# System Patterns

## Architecture Overview

- Next.js 15 App Router architecture
- Server-first component approach
- Monolithic application structure
- Feature-based directory organization
- Separation of concerns between server and client components
- Middleware-based authentication flow
- Neon db integration for backend services

## Design Patterns

- Functional Components
- Server Components by default
- Client Components when necessary
- Composition over inheritance
- Hooks for state and side effects
- Component composition with Shadcn UI
- Utility-first CSS with Tailwind
- Type-safe props with TypeScript interfaces

## Component Structure

- src/
  - app/ (Next.js pages and layouts)
  - components/ (reusable UI components)
  - lib/ (utility functions and configurations)
- Components follow atomic design:
  - Atoms (basic UI elements)
  - Molecules (composite components)
  - Organisms (complex components)
  - Templates (page layouts)
  - Pages (full pages)

## Data Flow

- Server-side data fetching with RSC
- Client-side state with React hooks
- Type-safe database queries
- Server actions for mutations
- Optimistic updates where applicable
- Error boundary fallbacks
- Loading states and suspense

## State Management

- Server state with RSC
- Local state with useState
- Form state with controlled components
- Auth state with Better-auth
- Route state with Next.js
- Error state with error boundaries
- Loading state with suspense
- Toast notifications with Sonner

## Security Patterns

- Route protection with middleware
- Type-safe API routes
- Environment variable protection
- CORS configuration
- XSS prevention
- CSRF protection
- Rate limiting
- Input validation
- Secure cookie handling

## Performance Patterns

- Server components for reduced JS
- Dynamic imports for code splitting
- Image optimization with Next.js
- Font optimization
- Static page generation where possible
- Incremental Static Regeneration
- Edge runtime optimization
- Caching strategies
- Bundle size optimization

## Error Handling

- Global error boundary
- Route error handling
- API error handling
- Type-safe error responses
- Toast notifications
- Form validation errors
- Network error recovery
- Fallback UI components
- Graceful degradation

## Notes

- Created on: March 19, 2024
- Last Updated: March 19, 2024
- Status: Implemented and Active
