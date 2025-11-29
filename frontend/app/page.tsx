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
          <Link href="/properties" className="no-underline">
            <Button
              variant="contained"
              size="large"
              className="px-8"
            >
              Browse Properties
            </Button>
          </Link>
          <Link href="/login" className="no-underline">
            <Button
              variant="outlined"
              size="large"
              className="px-8"
          >
              Login
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
