import Router from "next/router"

//Function that uses Next/Router to navigate to a specific path without scrolling to the top
export function navigateTo(path: string): void {
  Router.push(`${path}`, `${path}` , {scroll: false})
}
export function navigateBack(): void {
  Router.back()
}




