import React, { useEffect, useState } from 'react';

import { Button, Drawer, Stack, Typography } from '@mui/material';

import { useSamplesDrawerOpen, resetDocument } from '../../documents/editor/EditorContext';
import { getAccountTemplates, subscribeToTemplates, AccountTemplate } from '../../postMessageBridge';

import SidebarButton from './SidebarButton';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const [templates, setTemplates] = useState<AccountTemplate[]>(getAccountTemplates);

  useEffect(() => subscribeToTemplates(setTemplates), []);

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

          {templates.length > 0 && (
            <Stack width="100%" mt={1} spacing={0.5}>
              <Typography variant="caption" color="text.secondary" sx={{ px: 0.75, pb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Saved Presets
              </Typography>
              {templates.map((tpl, i) => (
                <Button
                  key={i}
                  size="small"
                  onClick={() => resetDocument(tpl.document as any)}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {tpl.name}
                </Button>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
}
