import manifest from "../data/image-manifest.json";

export const gallerySizes =
  "(max-width: 600px) 75vw, (max-width: 1000px) 45vw, 36vw";
export function responsiveSource(source, sizes) {
  const image = manifest[source];
  return {
    src: source,
    srcSet: image?.variants.map((v) => `${v.src} ${v.width}w`).join(", "),
    sizes,
  };
}

const prepared = new Map();
const queue = [];
let running = 0;
function run() {
  while (running < 3 && queue.length) {
    running++;
    const task = queue.shift();
    task().finally(() => {
      running--;
      run();
    });
  }
}
export function prepareImage(source, sizes = gallerySizes) {
  const key = `${source}:${sizes}`;
  if (!prepared.has(key))
    prepared.set(
      key,
      new Promise((resolve) => {
        queue.push(async () => {
          const image = new Image();
          const props = responsiveSource(source, sizes);
          image.decoding = "async";
          image.fetchPriority = "low";
          image.sizes = sizes;
          if (props.srcSet) image.srcset = props.srcSet;
          image.src = source;
          try {
            await image.decode();
            resolve(true);
          } catch {
            prepared.delete(key);
            image.removeAttribute("srcset");
            image.src = source;
            try {
              await image.decode();
              resolve(true);
            } catch {
              image.src = "/images/image-fallback.svg";
              try {
                await image.decode();
                resolve(true);
              } catch {
                resolve(false);
              }
            }
          }
        });
        run();
      }),
    );
  return prepared.get(key);
}
