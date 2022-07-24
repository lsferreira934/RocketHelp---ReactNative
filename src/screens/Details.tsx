import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, Text, VStack, useTheme, ScrollView, Box } from 'native-base';
import { CircleWavyCheck, Clipboard, DesktopTower, Hourglass } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { CardDetails } from '../components/CardDetails';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';

type RouteParams = {
    orderId: string
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

export function Details() {
    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState('');
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

    const navigator = useNavigation();
    const { colors } = useTheme()


    const route = useRoute();
    const { orderId } = route.params as RouteParams

    function handleOrderClosed() {
        if (!solution) return Alert.alert('Solicitação', 'Por favor, informe a solução do problema')


        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closedAt: firestore.FieldValue.serverTimestamp()
            }).then(() => {
                Alert.alert('Solicitação', 'Solicitação encerrada com sucesso')
                navigator.goBack()
            }).catch(error => {
                console.log(error)
                Alert.alert('Solicitação', 'Erro ao encerrar a Solicitação')
            })
    }


    useEffect(() => {
        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .get()
            .then(doc => {
                const { patrimony, description, status, createdAt, closedAt, solution } = doc.data();

                const closed = closedAt ? dateFormat(closedAt) : null;

                setOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    solution,
                    when: dateFormat(createdAt),
                    closed
                })

                setIsLoading(false);
            }).catch(erro => {
                console.log(erro);
            })
    }, [])

    if (isLoading) return <Loading />

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header
                    title='solicitação'
                />
            </Box>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }
                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title='equipamentos'
                    description={`Patrimônio:${order.patrimony} `}
                    icon={DesktopTower}
                    footer={order.when}
                />

                <CardDetails
                    title='descrição do problema'
                    description={`Patrimônio:${order.description} `}
                    icon={Clipboard}
                    footer={order.when}
                />

                <CardDetails
                    title='solução'
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {order.status === 'open' &&
                        <Input placeholder='Descrição da solução'
                            onChangeText={setSolution}
                            textAlignVertical='top'
                            multiline
                            h={24}
                        />
                    }
                </CardDetails>
            </ScrollView>
            {order.status === 'open' &&
                <Button
                    title="Encerrar solicitação"
                    m={5}
                    onPress={handleOrderClosed}
                />
            }
        </VStack>
    );
}