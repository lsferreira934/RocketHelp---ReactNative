import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import auth from '@react-native-firebase/auth';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import Logo from "../assets/logo_secondary.svg"
import { Button } from '../components/Button';
import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Alert } from 'react-native';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';

export function Home() {
    const [isloading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
    const [orders, setOrdes] = useState<OrderProps[]>([])

    const { colors } = useTheme();
    const navigation = useNavigation()

    function handleNewOrder() {
        navigation.navigate('new')
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId })
    }

    function handleLogout() {
        auth().
            signOut().
            catch(error => {
                console.log(error.code)
                return Alert.alert('Sair', 'Erro ao sair')
            })
    }

    useEffect(() => {
        setIsLoading(true);

        const subscriber = firestore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { patrimony, description, status, createdAt } = doc.data()

                    return {
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        when: dateFormat(createdAt)
                    }
                })
                setOrdes(data);
                setIsLoading(false);
            });

        return subscriber;
    }, [statusSelected])

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />
                <IconButton
                    icon={
                        <SignOut
                            size={26}
                            color={colors.gray[300]}
                        />
                    }
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignContent="center">
                    <Heading color="gray.100">
                        Solicitações
                    </Heading>
                    <Text color="gray.200">
                        {orders.length}
                    </Text>
                </HStack>


                <HStack space={3} mb={8}>
                    <Filter type="open" title='em andamento' isActive={statusSelected === 'open'} onPress={() => setStatusSelected('open')} />

                    <Filter type="closed" title='finalizados' isActive={statusSelected === 'closed'} onPress={() => setStatusSelected('closed')} />
                </HStack>
                {isloading
                    ? <Loading />
                    : <FlatList
                        data={orders}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText size={40} color={colors.gray[300]} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Você ainda não possui {'\n'}
                                    solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizados'}
                                </Text>
                            </Center>
                        )}
                    />
                }
                <Button title='Nova solicitação' onPress={handleNewOrder} />
            </VStack>
        </VStack >
    );
}