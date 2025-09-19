import { Box, Button, Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

// Mock order data
const orders = [
  { 
    id: 1, 
    customer: 'John Doe', 
    service: 'Portrait Photography', 
    date: '2023-05-15', 
    status: 'Completed', 
    amount: '$250' 
  },
  { 
    id: 2, 
    customer: 'Jane Smith', 
    service: 'Photo Printing', 
    date: '2023-05-18', 
    status: 'In Progress', 
    amount: '$75' 
  },
  { 
    id: 3, 
    customer: 'Robert Johnson', 
    service: 'Event Photography', 
    date: '2023-05-20', 
    status: 'Pending', 
    amount: '$500' 
  },
  { 
    id: 4, 
    customer: 'Emily Davis', 
    service: 'Photo Restoration', 
    date: '2023-05-22', 
    status: 'Completed', 
    amount: '$45' 
  },
  { 
    id: 5, 
    customer: 'Michael Wilson', 
    service: 'Custom Photo Book', 
    date: '2023-05-25', 
    status: 'In Progress', 
    amount: '$120' 
  },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'customer', headerName: 'Customer', width: 150 },
  { field: 'service', headerName: 'Service', width: 200 },
  { field: 'date', headerName: 'Date', width: 120 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 130,
    renderCell: (params) => (
      <Box
        sx={{
          color: params.value === 'Completed' ? 'success.main' : 
                params.value === 'In Progress' ? 'warning.main' : 
                'text.secondary',
          fontWeight: 500,
        }}
      >
        {params.value}
      </Box>
    ),
  },
  { field: 'amount', headerName: 'Amount', width: 100 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Button
        variant="outlined"
        size="small"
        onClick={() => console.log('View order:', params.row)}
      >
        View Details
      </Button>
    ),
  },
];

const AdminDashboard = () => {
  const [pageSize, setPageSize] = useState(5);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" component="p" gutterBottom sx={{ mb: 4 }}>
        Manage orders and view business analytics
      </Typography>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary">
          Export Orders
        </Button>
        <Button variant="contained" color="secondary">
          Create New Order
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;