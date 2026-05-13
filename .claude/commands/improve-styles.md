Use the `ui-ux-pro-max` skill and `frontend-design:frontend-design` skill to critically evaluate and improve the visual styling of the current component in the virtual file system.

$ARGUMENTS

## Your task

1. Read the current `/App.jsx` (and any other VFS files) to understand the component structure
2. Evaluate the visual design against professional UI/UX standards — look for:
   - Generic or overused Tailwind patterns (blue/purple gradients, default button pairs, `rounded-2xl shadow-2xl` on white over dark)
   - Weak typographic hierarchy
   - Unconsidered color choices or multi-hued sibling elements
   - Symmetrical layouts that could be more visually interesting
   - Padding and spacing that doesn't breathe
3. Rewrite the styling with a clear aesthetic point of view — choose one of: editorial, minimal/zen, warm artisan, bold typographic, or brutalist
4. Apply changes directly to the VFS files using `str_replace_editor`

## Constraints
- Do not change component logic, data, or structure — styling only
- Use only Tailwind utility classes, no inline styles
- Keep all existing `@/` import paths intact
- Every design decision should feel intentional, not default
