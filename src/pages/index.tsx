import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { Card, CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Response {
  after: string | null;
  data: Card[];
}

export default function Home(): JSX.Element {
  const fetchImages = async (pageParam): Promise<Response> => {
    const { data } = await api.get('api/images', {
      params: { after: pageParam },
    });

    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', ({ pageParam }) => fetchImages(pageParam), {
    getNextPageParam: ({ after }) => after,
  });

  const formattedData = useMemo(
    () => data?.pages.flatMap(({ data: item }) => item),
    [data]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            py={6}
            mt="10"
            d="flex"
            mx="auto"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant="outline"
            colorScheme="orange"
            _hover={{
              bg: 'orange.500',
              color: 'white',
              borderColor: 'orange.500',
            }}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
