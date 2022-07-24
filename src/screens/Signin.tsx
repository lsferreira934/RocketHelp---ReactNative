import { VStack, Heading, Icon, useTheme } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import { useState } from 'react'
import auth from '@react-native-firebase/auth'

import Logo from '../assets/logo_primary.svg'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from 'react-native'


export function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { colors } = useTheme();

    function handleSingIn() {
        if (!email || !password) {
            return Alert.alert('Entrar', 'Informe email e senha');
        };

        setIsLoading(true);

        auth()
            .signInWithEmailAndPassword(email, password)
            .then((r) =>{})
            .catch(error => {
                console.log(error.code)
                setIsLoading(false)

                const errorCode = {
                    ["invalid-email"]: 'Usuário não encontrado',
                    ["wrong-password"]: 'Email ou senha inválido',
                    ["user-not-found"]: 'Email ou senha inválido',
                    ["network-request-failed"]: 'Sem conexão com a internet'
                }

                for (const key in errorCode) {
                    if (error.code.includes(key)) return Alert.alert('Entrar', errorCode[key])
                }
            })
    }

    return (
        <VStack flex={1} alignItems="center" bg='gray.600' px={8} pt={24}>
            <Logo />
            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />

            <Input
                placeholder="Senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                mb={8}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button
                title="Entrar"
                w="full"
                onPress={handleSingIn}
                isLoading={isLoading}
            />

        </VStack>
    )
}