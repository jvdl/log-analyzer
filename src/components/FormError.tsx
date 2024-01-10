export function FormError({ error }: { error?: string | null }) {
  if (!error) {
    return null;
  }

  return (
    <div className="form-error">
      {error}
    </div>
  );
}
