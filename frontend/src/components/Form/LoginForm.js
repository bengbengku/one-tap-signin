import React, { useEffect, useState } from 'react';
import { useToggle, upperFirst, useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import './style.css';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Anchor,
  Stack,
} from '@mantine/core';
import axios from 'axios';
import Cookies from 'js-cookie';

function LoginForm({ setLoginData }) {
  const [type, toggle] = useToggle(['login', 'register']);
  const is824pxScreens = useMediaQuery('(max-width: 824px)');

  const handleCallbackResponse = async (response) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/google-login`, {
        token: response.credential,
      });
      setLoginData(data);
      localStorage.setItem('loginData', JSON.stringify(data));
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line no-undef
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
      });

      // eslint-disable-next-line no-undef
      google.accounts.id.renderButton(
        document.getElementById('buttonDiv'),
        { theme: 'filled_blue', size: 'large' } // customization attributes
      );
      // eslint-disable-next-line no-undef
      google.accounts.id.prompt();
    };
    document.body.appendChild(script);
  }, []);

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email anda tidak valid'),
      password: (val) => (val.length <= 6 ? 'Password min. 6 character' : null),
    },
  });

  const submitHandler = async (val) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/${type === 'register' ? 'register' : 'login'}`,
        {
          name: val.name,
          email: val.email,
          password: val.password,
        }
      );

      setLoginData(data);
      localStorage.setItem('loginData', JSON.stringify(data));
    } catch (err) {
      form.setErrors({ email: err.response.data });
      console.log(err.response.data.message);
    }
  };

  return (
    <Paper
      radius='md'
      p='xl'
      withBorder
      variant='md'
      style={{ width: is824pxScreens ? '80%' : '40%', margin: '8rem auto' }}
    >
      <Text size='lg' weight={500} align='center'>
        Welcome to Historia, {type} with
      </Text>

      <div id='buttonDiv'></div>

      <Divider label='Or continue with email' labelPosition='center' my='lg' />

      <form onSubmit={form.onSubmit((val) => submitHandler(val))}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label='Name'
              placeholder='Your name'
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius='md'
            />
          )}
          <TextInput
            required
            label='Email'
            placeholder='hello@youremail.com'
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Email atau password salah.'}
            radius='md'
          />

          <PasswordInput
            required
            label='Password'
            placeholder='Your password'
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password min. 6 character'}
            radius='md'
          />
        </Stack>

        <Group position='apart' mt='xl'>
          <Anchor
            component='button'
            type='button'
            color='dimmed'
            onClick={() => toggle()}
            size='xs'
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type='submit' radius='xl' color='red' style={{ zIndex: 99 }}>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

export default LoginForm;
