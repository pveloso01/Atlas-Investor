import Link from 'next/link';
import { Button, Typography, Box, Container } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="xl" className="py-16">
      <Box className="text-center mt-16">
        <Typography variant="h2" component="h1" className="mb-4 font-bold">
          Atlas Investor
        </Typography>
        <Typography variant="h5" className="mb-8 text-gray-600">
          Real Estate Investment Platform for Portugal
        </Typography>
        <Box className="mt-8 flex gap-4 justify-center">
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/properties"
            className="px-8"
          >
            Browse Properties
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/login"
            className="px-8"
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
