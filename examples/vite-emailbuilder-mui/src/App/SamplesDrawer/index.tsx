import React from 'react';

import { Drawer, Stack, Typography } from '@mui/material';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import SidebarButton from './SidebarButton';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={2} py={1} px={2} width={SAMPLES_DRAWER_WIDTH}>
        <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
          Templates
        </Typography>

        <Stack alignItems="flex-start" sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <SidebarButton href="#">Blank</SidebarButton>
        </Stack>
      </Stack>
    </Drawer>
  );
}
