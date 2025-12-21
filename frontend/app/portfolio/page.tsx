'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  TrendingUp,
  TrendingDown,
  Home as HomeIcon,
  Euro,
  OpenInNew,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { colors } from '@/lib/theme/colors';
import {
  useGetPortfoliosQuery,
  useGetPortfolioQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useRemovePropertyFromPortfolioMutation,
  useUpdatePropertyInPortfolioMutation,
  Portfolio,
  PortfolioProperty,
} from '@/lib/store/api/portfolioApi';

export default function PortfolioPage() {
  const router = useRouter();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPropertyDialogOpen, setEditPropertyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [editingProperty, setEditingProperty] = useState<PortfolioProperty | null>(null);
  const [propertyNotes, setPropertyNotes] = useState('');
  const [propertyTargetPrice, setPropertyTargetPrice] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPortfolio, setMenuPortfolio] = useState<Portfolio | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: portfolios, isLoading: isLoadingPortfolios } = useGetPortfoliosQuery();
  const { data: selectedPortfolio, isLoading: isLoadingPortfolio } = useGetPortfolioQuery(
    selectedPortfolioId || 0,
    { skip: !selectedPortfolioId }
  );

  const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation();
  const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation();
  const [deletePortfolio, { isLoading: isDeleting }] = useDeletePortfolioMutation();
  const [removeProperty] = useRemovePropertyFromPortfolioMutation();
  const [updateProperty] = useUpdatePropertyInPortfolioMutation();

  // Select first portfolio by default
  React.useEffect(() => {
    if (portfolios && portfolios.length > 0 && !selectedPortfolioId) {
      const defaultPortfolio = portfolios.find((p) => p.is_default) || portfolios[0];
      setSelectedPortfolioId(defaultPortfolio.id);
    }
  }, [portfolios, selectedPortfolioId]);

  const handleCreatePortfolio = async () => {
    if (!newPortfolioName.trim()) return;
    try {
      const result = await createPortfolio({
        name: newPortfolioName.trim(),
        description: newPortfolioDescription.trim(),
      }).unwrap();
      setSelectedPortfolioId(result.id);
      setCreateDialogOpen(false);
      setNewPortfolioName('');
      setNewPortfolioDescription('');
      setSnackbar({ open: true, message: 'Portfolio created successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to create portfolio', severity: 'error' });
    }
  };

  const handleUpdatePortfolio = async () => {
    if (!menuPortfolio || !newPortfolioName.trim()) return;
    try {
      await updatePortfolio({
        id: menuPortfolio.id,
        name: newPortfolioName.trim(),
        description: newPortfolioDescription.trim(),
      }).unwrap();
      setEditDialogOpen(false);
      setMenuPortfolio(null);
      setSnackbar({ open: true, message: 'Portfolio updated successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update portfolio', severity: 'error' });
    }
  };

  const handleDeletePortfolio = async () => {
    if (!menuPortfolio) return;
    try {
      await deletePortfolio(menuPortfolio.id).unwrap();
      if (selectedPortfolioId === menuPortfolio.id) {
        setSelectedPortfolioId(null);
      }
      setDeleteDialogOpen(false);
      setMenuPortfolio(null);
      setSnackbar({ open: true, message: 'Portfolio deleted successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete portfolio', severity: 'error' });
    }
  };

  const handleRemoveProperty = async (propertyId: number) => {
    if (!selectedPortfolioId) return;
    try {
      await removeProperty({
        portfolioId: selectedPortfolioId,
        property_id: propertyId,
      }).unwrap();
      setSnackbar({ open: true, message: 'Property removed from portfolio', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to remove property', severity: 'error' });
    }
  };

  const handleUpdateProperty = async () => {
    if (!selectedPortfolioId || !editingProperty) return;
    try {
      await updateProperty({
        portfolioId: selectedPortfolioId,
        property_id: editingProperty.property_id,
        notes: propertyNotes,
        target_price: propertyTargetPrice ? parseFloat(propertyTargetPrice) : null,
      }).unwrap();
      setEditPropertyDialogOpen(false);
      setEditingProperty(null);
      setSnackbar({ open: true, message: 'Property updated!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update property', severity: 'error' });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, portfolio: Portfolio) => {
    setAnchorEl(event.currentTarget);
    setMenuPortfolio(portfolio);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPortfolio(null);
  };

  const openEditDialog = () => {
    if (menuPortfolio) {
      setNewPortfolioName(menuPortfolio.name);
      setNewPortfolioDescription(menuPortfolio.description);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const openEditPropertyDialog = (property: PortfolioProperty) => {
    setEditingProperty(property);
    setPropertyNotes(property.notes || '');
    setPropertyTargetPrice(property.target_price || '');
    setEditPropertyDialogOpen(true);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  if (isLoadingPortfolios) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading portfolios...</Typography>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.neutral.gray900 }}>
            My Portfolios
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray600, mt: 1 }}>
            Manage your investment portfolios and track properties
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            backgroundColor: colors.primary.main,
            '&:hover': { backgroundColor: colors.primary.dark },
          }}
        >
          New Portfolio
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Portfolio List Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Portfolios ({portfolios?.length || 0})
            </Typography>
            {portfolios?.length === 0 ? (
              <Alert severity="info">No portfolios yet. Create one to get started!</Alert>
            ) : (
              portfolios?.map((portfolio) => (
                <Card
                  key={portfolio.id}
                  sx={{
                    mb: 1,
                    cursor: 'pointer',
                    border:
                      selectedPortfolioId === portfolio.id
                        ? `2px solid ${colors.primary.main}`
                        : '1px solid transparent',
                    backgroundColor:
                      selectedPortfolioId === portfolio.id
                        ? colors.primary.main + '10'
                        : 'transparent',
                    '&:hover': { backgroundColor: colors.neutral.gray100 },
                  }}
                  onClick={() => setSelectedPortfolioId(portfolio.id)}
                >
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {portfolio.name}
                          </Typography>
                          {portfolio.is_default && (
                            <Star sx={{ fontSize: 16, color: colors.accent.main }} />
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                          {portfolio.property_count} properties •{' '}
                          {formatPrice(portfolio.total_value)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, portfolio);
                        }}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        {/* Portfolio Details */}
        <Grid size={{ xs: 12, md: 9 }}>
          {isLoadingPortfolio ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : selectedPortfolio ? (
            <Paper sx={{ p: 3 }}>
              {/* Portfolio Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 3,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {selectedPortfolio.name}
                    </Typography>
                    {selectedPortfolio.is_default && (
                      <Chip label="Default" size="small" color="primary" />
                    )}
                  </Box>
                  {selectedPortfolio.description && (
                    <Typography variant="body2" sx={{ color: colors.neutral.gray600, mt: 1 }}>
                      {selectedPortfolio.description}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Portfolio Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ p: 2, backgroundColor: colors.neutral.gray50, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                      Properties
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {selectedPortfolio.property_count}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ p: 2, backgroundColor: colors.neutral.gray50, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                      Total Value
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main }}>
                      {formatPrice(selectedPortfolio.total_value)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ p: 2, backgroundColor: colors.neutral.gray50, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                      Average Price
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {selectedPortfolio.average_price
                        ? formatPrice(selectedPortfolio.average_price)
                        : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Properties List */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Properties
              </Typography>

              {selectedPortfolio.properties?.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No properties in this portfolio yet.{' '}
                  <Button size="small" onClick={() => router.push('/dashboard')}>
                    Browse properties
                  </Button>
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {selectedPortfolio.properties?.map((property) => (
                    <Grid size={{ xs: 12 }} key={property.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <HomeIcon sx={{ color: colors.primary.main }} />
                                <Box>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      '&:hover': { color: colors.primary.main },
                                    }}
                                    onClick={() =>
                                      router.push(`/properties/${property.property_id}`)
                                    }
                                  >
                                    {property.property_address}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: colors.neutral.gray600 }}
                                  >
                                    {property.property_type} • {property.size_sqm} m² •{' '}
                                    {property.bedrooms || 0} bed
                                    {property.region_name && ` • ${property.region_name}`}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 6, md: 2 }}>
                              <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                                Current Price
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600, color: colors.primary.main }}
                              >
                                {formatPrice(property.property_price)}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, md: 2 }}>
                              <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                                Target Price
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {property.target_price
                                  ? formatPrice(property.target_price)
                                  : 'Not set'}
                              </Typography>
                              {property.price_difference && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {property.price_difference.is_below_target ? (
                                    <TrendingDown
                                      sx={{ fontSize: 14, color: colors.success.main }}
                                    />
                                  ) : (
                                    <TrendingUp sx={{ fontSize: 14, color: colors.error.main }} />
                                  )}
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: property.price_difference.is_below_target
                                        ? colors.success.main
                                        : colors.error.main,
                                    }}
                                  >
                                    {property.price_difference.percentage > 0 ? '+' : ''}
                                    {property.price_difference.percentage.toFixed(1)}%
                                  </Typography>
                                </Box>
                              )}
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Tooltip title="View property">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      router.push(`/properties/${property.property_id}`)
                                    }
                                  >
                                    <OpenInNew fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit notes">
                                  <IconButton
                                    size="small"
                                    onClick={() => openEditPropertyDialog(property)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Remove from portfolio">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveProperty(property.property_id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Grid>
                            {property.notes && (
                              <Grid size={{ xs: 12 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: colors.neutral.gray600, fontStyle: 'italic' }}
                                >
                                  Notes: {property.notes}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.neutral.gray600 }}>
                Select a portfolio to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Portfolio Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={openEditDialog}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {!menuPortfolio?.is_default && (
          <MenuItem
            onClick={() => {
              if (menuPortfolio) {
                updatePortfolio({ id: menuPortfolio.id, is_default: true });
              }
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <StarBorder fontSize="small" />
            </ListItemIcon>
            <ListItemText>Set as Default</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={openDeleteDialog} sx={{ color: colors.error.main }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: colors.error.main }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create Portfolio Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Portfolio Name"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description (optional)"
            multiline
            rows={3}
            value={newPortfolioDescription}
            onChange={(e) => setNewPortfolioDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreatePortfolio}
            disabled={!newPortfolioName.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Portfolio Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Portfolio Name"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description (optional)"
            multiline
            rows={3}
            value={newPortfolioDescription}
            onChange={(e) => setNewPortfolioDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdatePortfolio}
            disabled={!newPortfolioName.trim() || isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Portfolio Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Portfolio</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{menuPortfolio?.name}&quot;? This will remove all
            properties from this portfolio.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeletePortfolio}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog
        open={editPropertyDialogOpen}
        onClose={() => setEditPropertyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Property in Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={propertyNotes}
            onChange={(e) => setPropertyNotes(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Target Price (€)"
            type="number"
            value={propertyTargetPrice}
            onChange={(e) => setPropertyTargetPrice(e.target.value)}
            InputProps={{
              startAdornment: <Euro sx={{ color: colors.neutral.gray400, mr: 1 }} />,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPropertyDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProperty}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
    </ProtectedRoute>
  );
}
