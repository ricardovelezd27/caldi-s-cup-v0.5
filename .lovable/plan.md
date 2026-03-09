

# Fix: Update 4 Coffees from Error Reports and Mark Resolved

## Data gathered

| # | Coffee ID | Current Name | Current Brand | Fix |
|---|-----------|-------------|---------------|-----|
| 1 | `e70fe406-20f4-4322-b143-e81950509d67` | Peaberry Lavado | Kafe ROASTERS | Brand → `Okafe` |
| 2 | `c4e6ec00-70ca-4d7b-bef3-2425097f9b4b` | Unknown Coffee | Tucán | Name → `Tucán`, Brand → `Nica Brewer Roaster` |
| 3 | `6215a64f-7538-4558-b6b9-fd23c555e52d` | TASSE TOI | (null) | Brand → `2AM` |
| 4 | `6037afe1-41d0-453f-bf7d-7718c849ec85` | Cherry Induced Addiction | VHS COFFEE SOURCING | Brand → `People Possesion` |

Error report IDs to delete: `0e1ab0fb`, `797a7d12`, `c49b3d05`, `09502ce5`, `b73577c2`

## Changes

### 1. Database data updates (via insert/update tool)

Four UPDATE statements on `coffees` table, then DELETE the 5 error report rows from `scan_error_reports`:

```sql
UPDATE coffees SET brand = 'Okafe', updated_at = now() WHERE id = 'e70fe406-20f4-4322-b143-e81950509d67';
UPDATE coffees SET name = 'Tucán', brand = 'Nica Brewer Roaster', updated_at = now() WHERE id = 'c4e6ec00-70ca-4d7b-bef3-2425097f9b4b';
UPDATE coffees SET brand = '2AM', updated_at = now() WHERE id = '6215a64f-7538-4558-b6b9-fd23c555e52d';
UPDATE coffees SET brand = 'People Possesion', updated_at = now() WHERE id = '6037afe1-41d0-453f-bf7d-7718c849ec85';

DELETE FROM scan_error_reports WHERE id IN (
  '0e1ab0fb-42a4-4e62-986a-f6a28cf36189',
  '797a7d12-c3ff-4e08-8419-04b59c101b74',
  'c49b3d05-785e-4db8-870f-d29ea2ce4869',
  '09502ce5-9d14-4aef-8dd5-0bc3b96a86bc',
  'b73577c2-ceb8-4a63-b36b-7878211225bb'
);
```

### 2. No code changes needed

These are data-only fixes. The coffees table RLS allows admin updates, and scan_error_reports allows admin deletes.

