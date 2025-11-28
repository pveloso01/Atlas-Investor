import { Typography, Box, Container } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="sm" className="py-16">
      <Box className="mt-8">
        <Typography variant="h4" component="h1" className="mb-4">
          Login
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Login form will be displayed here.
        </Typography>
      </Box>
    </Container>
  );
}


