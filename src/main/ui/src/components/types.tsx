export type BeerFormProps = {
  getLicenseTypes: () => Promise<string[]>,
  refetch: () => {}
}

export type BasePopupProps = {
  contentText?: string,
  open: boolean,
  onClose: () => void
}

export type AlertProps = BasePopupProps & {
  title: string,
  submitButtonText: string,
  asyncRequest?: () => any,
}

export type AlertPromptProps = AlertProps & {
  asyncRequest?: () => any
}

export type SnackbarPopupProps = BasePopupProps & {
  severity: "error" | "success" | "info" | "warning",
  timeout?: number
}

export { }