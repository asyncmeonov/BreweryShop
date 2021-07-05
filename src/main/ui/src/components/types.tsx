import { AlertProps } from "@material-ui/lab/Alert"

export type BeerFormProps = {
    Alert: (props: AlertProps) => JSX.Element,
    getLicenseTypes: () => Promise<string[]>,
    refetch: () => {}
  }

export {}