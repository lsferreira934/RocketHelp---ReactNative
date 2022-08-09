import { VStack, Text, Heading, Icon, useTheme, HStack, IconButton } from 'native-base';
import auth from '@react-native-firebase/auth'
import { Envelope, Key, SignOut } from 'phosphor-react-native';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import Logo from '../assets/logo_primary.svg'
import { Alert } from 'react-native';
import { Header } from '../components/Header';

export function Account() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme()

  function handleCreateAccount() {
    if (!email || !password) {
      return Alert.alert('Cadastro', 'Informe email e senha');
    };

    if (password !== checkPassword) {
      return Alert.alert('Cadastro', 'Senhas não conferem')
    }

    setIsLoading(true);

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Cadastro', 'Usuário criado com sucesso')
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error.code)
        setIsLoading(false);

        const errorCode = {
          ['email-already-in-use']: 'Email já cadastrado',
          ['invalid-email']: 'Email inválido',
        }


        for (const key in errorCode) {
          if (error.code.includes(key)) return Alert.alert('Cadastro', errorCode[key])
        }
      })
  }



  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <Header  title='Crie a sua conta'  p={6}/>
      <VStack flex={1} alignItems="center" bg='gray.600' px={8} pt={15}>
        <Logo  />
    
        <Input
          placeholder="Seu E-mail"
          onChangeText={setEmail}
          InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
          mb={10}
          mt={20}
        />

        <Input
          placeholder="Sua senha"
          onChangeText={setPassword}
          InputLeftElement={<Icon as={<Key color={password === '' ? colors.gray[300] : (password === checkPassword ? colors.green[300] : colors.red[600])} />} ml={4} />}
          mb={2}
          secureTextEntry

        />

        <Input
          placeholder="Confirme sua senha"
          onChangeText={setCheckPassword}
          InputLeftElement={<Icon as={<Key color={checkPassword === '' ? colors.gray[300] : (password === checkPassword ? colors.green[300] : colors.red[600])} />} ml={4} />}
          mb={8}
          secureTextEntry
          _focus={password !== checkPassword ? {
            borderWidth: 1,
            borderColor: "red.600",
            bg: "gray.700"
          } : {
            borderWidth: 1,
            borderColor: "green.500",
            bg: "gray.700"
          }}
        />

        <Button
          title="Criar conta"
          w="full"
          onPress={handleCreateAccount}
          isLoading={isLoading}
        />

      </VStack>

    </VStack>
  );
}