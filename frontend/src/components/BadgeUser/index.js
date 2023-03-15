import React from 'react';
import { UnstyledButton, Group, Avatar, Text, createStyles, Badge, Center } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    height: '100px',
    width: '40%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },

    [`@media (max-width: 960px)`]: {
      width: '70%',
    },

    [`@media (max-width: 472px)`]: {
      width: '90%',
    },
  },
  home: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function BadgeUser({ handleLogout, loginData }) {
  const { classes } = useStyles();
  return (
    <div className={classes.home}>
      <UnstyledButton className={classes.user}>
        <Group>
          <Avatar src={`${loginData && loginData.picture ? loginData.picture : ''}`} radius='xl' />

          <div style={{ flex: 1 }}>
            <Text size='sm' weight={500}>
              {loginData.name}
            </Text>

            <Text color='dimmed' size='xs'>
              {loginData.email}
            </Text>
          </div>

          <IconLogout size='2rem' stroke={1.5} onClick={handleLogout} />
        </Group>
      </UnstyledButton>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          margin: '1rem auto',
        }}
      >
        <Text c='dimmed' fz={16}>
          Anda login menggunakan
        </Text>
        <Badge color='cyan' style={{ transform: 'translateY(2px)' }}>
          {loginData.provider}
        </Badge>
      </div>
    </div>
  );
}

export default BadgeUser;
