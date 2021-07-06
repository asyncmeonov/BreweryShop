export type BeerFormProps = {
  getLicenseTypes: () => Promise<string[]>,
  refetch: () => {}
}

export type PopupProps = {
  title: string,
  contentText: string,
  submitButtonText: string,
  open: boolean,
  asyncRequest?: () => any,
  onClose: () => void
}
export { }