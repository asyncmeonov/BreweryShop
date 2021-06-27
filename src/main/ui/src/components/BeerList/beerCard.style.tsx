import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    border: 1px solid gray;
    border-radius: 20px;

    button {
        height: 100%;
        border-radius: 0 20px 20px 0;
    }
`;

export const BeerCardDiv = styled.div`
    /* flex: 1; */
    font-family: Arial, Helvetica, sans-serif;
    padding: 1rem;
    img {
        width: 25vh;//30%;
    }
`;