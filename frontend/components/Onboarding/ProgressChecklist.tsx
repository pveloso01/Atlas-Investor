'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  action?: () => void;
}

interface ProgressChecklistProps {
  title?: string;
  items: ChecklistItem[];
  onItemComplete?: (itemId: string) => void;
  onAllComplete?: () => void;
}

export default function ProgressChecklist({
  title = "Beginner's Checklist",
  items,
  onItemComplete,
  onAllComplete,
}: ProgressChecklistProps) {
  const [checklistItems, setChecklistItems] = useState(items);

  const completedCount = checklistItems.filter((item) => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;

  const handleToggle = (itemId: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newCompleted = !item.completed;
          if (newCompleted) {
            onItemComplete?.(itemId);
          }
          return { ...item, completed: newCompleted };
        }
        return item;
      })
    );

    // Check if all items are completed
    const allCompleted = checklistItems.every(
      (item) => item.id === itemId || item.completed
    );
    if (allCompleted && !checklistItems.find((item) => item.id === itemId)?.completed) {
      onAllComplete?.();
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        border: `1px solid ${colors.neutral.gray200}`,
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
            Progress
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary.main }}>
            {completedCount} / {checklistItems.length}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 1,
            backgroundColor: colors.neutral.gray200,
            '& .MuiLinearProgress-bar': {
              backgroundColor: colors.success.main,
              borderRadius: 1,
            },
          }}
        />
      </Box>

      <List>
        {checklistItems.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            sx={{
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemButton
              onClick={() => handleToggle(item.id)}
              sx={{
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: colors.neutral.gray50,
                },
              }}
            >
              <ListItemIcon>
                {item.completed ? (
                  <CheckCircleIcon sx={{ color: colors.success.main }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ color: colors.neutral.gray400 }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? colors.neutral.gray500 : colors.neutral.gray900,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {progress === 100 && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: colors.success.main + '10',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600, color: colors.success.main }}>
            🎉 Congratulations! You&apos;ve completed the checklist!
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

