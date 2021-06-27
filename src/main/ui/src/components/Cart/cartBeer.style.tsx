import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    font-family: Aria, Helvetica, sans-serif;
    border-bottom: 1px solid grey;
    padding-bottom: 20px;

    div{
        flex:1;
    }

    .information,
    .buttons {
        display: flex;
        justify-content: space-between;
    }
`;