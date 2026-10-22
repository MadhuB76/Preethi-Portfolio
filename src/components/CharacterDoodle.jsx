export default function CharacterDoodle({
  character,
  className = "",
  loading = "lazy",
}) {
  return (
    <img
      className={`character-doodle ${className}`}
      src={`/images/characters/${character}.png`}
      alt=""
      aria-hidden="true"
      loading={loading}
      decoding="async"
      width="400"
      height="600"
    />
  );
}
