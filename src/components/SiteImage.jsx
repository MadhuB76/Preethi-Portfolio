import { responsiveSource } from "../lib/siteImages";

export default function SiteImage({
  src,
  sizes = "100vw",
  loading = "lazy",
  ...props
}) {
  return (
    <img
      {...props}
      {...responsiveSource(src, sizes)}
      loading={loading}
      decoding="async"
      onError={({ currentTarget: image }) => {
        // Retry the original when a responsive candidate fails; never loop errors.
        if (!image.dataset.retried) {
          image.dataset.retried = "true";
          image.removeAttribute("srcset");
          image.src = src;
        } else if (!image.dataset.fallback) {
          image.dataset.fallback = "true";
          image.src = "/images/image-fallback.svg";
        }
      }}
    />
  );
}
