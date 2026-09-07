type DeliveryKind = "work" | "contained" | "large" | "poster" | "video"

const TRANSFORMS: Record<DeliveryKind, string> = {
  work: "f_auto,q_auto:good,c_limit,w_1400",
  contained: "f_auto,q_auto:good,c_limit,w_1800",
  large: "f_auto,q_auto:best,c_limit,w_2400",
  poster: "so_0,f_jpg,q_auto:good,c_limit,w_1800",
  video: "f_auto,q_auto:good",
}

function isCloudinaryDeliveryUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && url.pathname.includes("/upload/")
  } catch {
    return false
  }
}

export function cloudinaryDeliveryUrl(source: string, kind: DeliveryKind) {
  if (!isCloudinaryDeliveryUrl(source)) return source

  const url = new URL(source)
  url.pathname = url.pathname.replace("/upload/", `/upload/${TRANSFORMS[kind]}/`)

  if (kind === "poster") {
    url.pathname = url.pathname.replace(/\.[a-z0-9]+$/i, ".jpg")
  }

  return url.toString()
}
