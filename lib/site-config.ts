// Existing repository branding and attribution; no invented identity or credits.
export const siteConfig = {
  logo: { src: "/mtk-logo-dark.png", width: 500, height: 500 },
  social: [
    { name: "Instagram", href: "https://www.instagram.com/gustavoreynosomtk/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/gustavo-reynoso-b33799102/" },
  ],
  credit: { name: "ING. JMDR", href: "https://www.linkedin.com/in/jose-manuel-de-jesus-rodriguez-5a0981177", role: { en: "Designed by", es: "Diseñada por" } },
} as const

export const homeFilms = {
  hero: "https://res.cloudinary.com/vloh9uw1/video/upload/v1788368704/AS%C3%8D_SE_TRBAJA_EN_MTK_y_ustedes_ACOTAO_El_real_dream_team-_jdfilm.s_berroa_photography01_jh.mp4",
  production: "https://res.cloudinary.com/vloh9uw1/video/upload/v1788491255/Selling_las_terrenas_EPISODE_2_is_OUT_now_With_best_cast_ever-_elena_realtordr_sellingdrwithna.mp4",
} as const

export function filmPoster(source: string, width = 960, second = 1) {
  return source.replace("/upload/", `/upload/so_${second},f_jpg,q_auto:good,c_limit,w_${width}/`).replace(/\.mp4$/, ".jpg")
}
