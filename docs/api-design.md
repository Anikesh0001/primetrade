# API Design

## REST Design Decisions

- Resource-oriented paths (`/projects`, `/users`).
- Consistent versioning under `/api/v1`.
- Stateless authentication using JWT.

## Status Code Strategy

- `200` for successful reads and updates
- `201` for resource creation
- `400` for validation errors
- `401` for authentication errors
- `403` for authorization errors
- `404` for missing resources
- `409` for conflicts (e.g., duplicate email)
- `500` for unexpected errors

## Error Response Format

```
{
  "success": false,
  "message": "Human-readable message",
  "data": null,
  "details": {}
}
```

## Response Format

```
{
  "success": true,
  "data": {},
  "message": ""
}
```

## Versioning

All endpoints are prefixed with `/api/v1` to allow non-breaking upgrades.

## Pagination

- `page` and `limit` query parameters
- Page size capped in the service layer
- Response includes `meta` with `total`, `page`, `limit`, `pages`

## Security Considerations

- JWT access + refresh tokens
- Password hashing with bcrypt
- Validation using Zod
- Rate limiting + Helmet + input sanitization
- RBAC enforcement in middleware and services

