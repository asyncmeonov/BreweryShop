import { useState } from "react";
//Components
import LinearProgress from "@material-ui/core/LinearProgress";
//styles
import { Wrapper } from "./AdminOrderView.style";
import { AdminOrder, BeerType } from "../interfaces";
import { get } from "../Http";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import CustomAppBar from "../CustomAppBar";
import { useQuery } from "react-query";
import { XGrid } from '@material-ui/x-grid';
import { formatPrice } from "../../window";

function formatBeerForTable(beer: BeerType): string {
  return beer.name + ": " + beer.amount + "x" + beer.size + "ml";
}

const getOrders = async (): Promise<AdminOrder[]> =>
  get<AdminOrder[]>("/admin/order");

const AdminOrderView = () => {
  const { data, isLoading, error } = useQuery<AdminOrder[]>(
    "AdminOrder",
    getOrders
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order №', width: 150 },
    { field: 'pirateName', headerName: 'Name', width: 150 },
    { field: 'orderBeers', headerName: 'Beers', width: 150 },
    { field: 'total', headerName: 'Total Price', width: 150 },
    { field: "pirateContact", headerName: "Contact", width: 300 },
    { field: "dateCreated", headerName: "Created", width: 150 },
    { field: "dateCompleted", headerName: "Completed Date", width: 150 },
    { field: "notes", headerName: "Notes", width: 150 }
  ];

  if (window.token === undefined || !window.isAdmin) {
    return (
      <Wrapper>
        <div>
          You don't have a valid license. Go back to the <a href="/">homepage</a>
        </div>
      </Wrapper>
    );
  }
  if (isLoading) return <LinearProgress />;
  if (error) return <div> Something went wrong... {error} </div>;

  const rows = data?.map(row => {
    return {
      id: row.id,
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
      <CustomAppBar/>
      {/* you can use DataGrid instead of XGrid  */}
      <DataGrid rows={rows ? rows : []} columns={columns} autoHeight autoPageSize/>
    </Wrapper>
  );
};

export default AdminOrderView;
