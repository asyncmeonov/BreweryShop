//Components
import LinearProgress from "@material-ui/core/LinearProgress";
//styles
import { Wrapper } from "./AdminOrderView.style";
import { AdminOrder, BeerType } from "../interfaces";
import { get } from "../Http";
import { DataGrid, GridColDef, GridRowSelectedParams } from "@material-ui/data-grid";
import CustomAppBar from "../CustomAppBar";
import { useQuery } from "react-query";
import { XGrid } from '@material-ui/x-grid';
import { formatPrice, getGlobalIsAdmin, getGlobalToken } from "../../window";
import { useState } from "react";
import { Drawer } from "@material-ui/core";
import AdminOrderDetailsView from "./AdminOrderDetailsView";
import { useHistory } from "react-router-dom";

function formatBeerForTable(beer: BeerType): string {
  return beer.name + ": " + beer.amount + "x" + beer.size + "ml";
}

const getOrders = async (): Promise<AdminOrder[]> =>
  get<AdminOrder[]>("/admin/order");

const AdminOrderView = () => {
  const { data, isLoading, error, refetch } = useQuery<AdminOrder[]>(
    "AdminOrder",
    getOrders
  );

  const [selected, setSelected] = useState<AdminOrder | undefined>();
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const history = useHistory();

  const toggleDetailView = () => setDetailViewOpen(!isDetailViewOpen);

  const handleRowSelect = (row: GridRowSelectedParams) => {
    let id = (row.data as AdminOrder).id;
    let selected = data?.find(beer=> beer.id === id);
    setSelected(selected);
    setDetailViewOpen(true);
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order №', width: 150 },
    { field: 'license', headerName: 'License', width: 150 },
    { field: 'licenseType', headerName: 'Type', width: 150 },
    { field: 'pirateName', headerName: 'Name', width: 150 },
    { field: 'orderBeers', headerName: 'Beers', width: 150 },
    { field: 'total', headerName: 'Total Price', width: 150 },
    { field: "pirateContact", headerName: "Contact", width: 300 },
    { field: "dateCreated", headerName: "Created", width: 150 },
    { field: "dateCompleted", headerName: "Completed Date", width: 150 },
    { field: "notes", headerName: "Notes", width: 150 }
  ];

  if (getGlobalToken() === undefined || !getGlobalIsAdmin()) {
    history.push({ pathname: "/", state: { hasExpired: true } })
  }
  if (isLoading && !data) return <LinearProgress />;
  if (error) return <div> Something went wrong... {error} </div>;

  const rows = data?.map(row => {
    return {
      id: row.id,
      license: row.license,
      licenseType: row.licenseType,
      pirateName: row.pirateName,
      orderBeers: row.orderBeers
        .map((beer) => formatBeerForTable(beer))
        .join(", "),
      total: formatPrice(row.total),
      pirateContact: row.pirateContact,
      dateCreated: row.dateCreated,
      dateCompleted: row.dateCompleted,
      notes: row.notes
    };
  });

  return (
    <Wrapper>
      <CustomAppBar />
      {/* you can use DataGrid instead of XGrid  */}
      <DataGrid
        rows={rows ? rows : []}
        columns={columns}
        autoHeight
        autoPageSize
        onRowSelected={row => handleRowSelect(row)}
      />
      <Drawer
        anchor="right"
        open={isDetailViewOpen}
        onClose={() => toggleDetailView()}
      >
        {selected && <AdminOrderDetailsView {...{order: selected, toggleView: toggleDetailView, refetch}} />}
      </Drawer>
    </Wrapper>
  );
};

export default AdminOrderView;
