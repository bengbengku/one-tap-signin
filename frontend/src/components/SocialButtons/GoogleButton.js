import { Button } from '@mantine/core';
import { GoogleIcon } from './GoogleIcon';

export function GoogleButton(props) {
  return <Button leftIcon={<GoogleIcon />} variant='default' color='gray' {...props} />;
}
