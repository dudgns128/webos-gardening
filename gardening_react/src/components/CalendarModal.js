import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from 'moment';

const theme = {
    gray_1: '#333',
    red_1: '#ff0000',
    blue: '#007bff',
    gray_5: '#f7f7f7',
    yellow_2: '#FFED8C',
    wine: '#8b0000',
    green: '#009C4D',
    orange: '#FFA500',
    darkBlack: '#000',
  };

  const StyledCalendarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  .react-calendar {
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 4px 2px 10px 0px rgba(0, 0, 0, 0.13);
    padding: 3% 5%;
    background-color: white;
  }

  /* 전체 폰트 컬러 */
  .react-calendar__month-view {
    abbr {
      color: ${(props) => props.theme.gray_1};
    }
  }

  /* 네비게이션 가운데 정렬 */
  .react-calendar__navigation {
    justify-content: center;
  }

  /* 네비게이션 폰트 설정 */
  .react-calendar__navigation button {
    font-weight: 800;
    font-size: 1rem;
  }

  /* 네비게이션 버튼 컬러 */
  .react-calendar__navigation button:focus {
    background-color: white;
  }

  /* 네비게이션 비활성화 됐을때 스타일 */
  .react-calendar__navigation button:disabled {
    background-color: white;
    color: ${(props) => props.theme.darkBlack};
  }

  /* 년/월 상단 네비게이션 칸 크기 줄이기 */
  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  /* 요일 밑줄 제거 */
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }

  /* 일요일에만 빨간 폰트 */
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="일요일"] {
    color: ${(props) => props.theme.red_1};
  }

  /* 오늘 날짜 폰트 컬러 */
  .react-calendar__tile--now {
    background: none;
    abbr {
      color: ${(props) => props.theme.orange};
    }
  }

  /* 네비게이션 전체적인 월 스타일 적용 */
  .react-calendar__year-view__months__month {
    border-radius: 0.8rem;
    background-color: ${(props) => props.theme.gray_5};
    padding: 0;
  }

  /* 네비게이션 현재 월 스타일 적용 */
  .react-calendar__tile--hasActive {
    background-color: ${(props) => props.theme.blue};
    abbr {
      color: white;
    }
  }

  /* 일 날짜 간격 */
  .react-calendar__tile {
    padding: 5px 0px 18px;
    position: relative;
  }

  /* 네비게이션 월 스타일 적용 */
  .react-calendar__year-view__months__month {
    flex: 0 0 calc(33.3333% - 10px) !important;
    margin-inline-start: 5px !important;
    margin-inline-end: 5px !important;
    margin-block-end: 10px;
    padding: 20px 6.6667px;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${(props) => props.theme.gray_1};
  }

  /* 선택한 날짜 스타일 적용 --->  계속해서 특정 월과 날짜가 자동으로 클릭되는 현상 발생, 날짜 클릭해서 부가적인 기능 사용 없어서 주석 처리*/            
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    background-color: ${(props) => props.theme.yellow_2};
    border-radius: 0.3rem;
  }
`;

const StyledCalendar = styled(Calendar)``;

/* 오늘 날짜에 텍스트 삽입 스타일 */
const StyledToday = styled.div`
  font-size: x-small;
  color: ${(props) => props.theme.wine};
  font-weight: 600;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`;

/* 출석한 날짜에 점 표시 스타일 */
const StyledDot = styled.div`
  background-color: ${(props) => props.theme.green};
  border-radius: 50%;
  width: 0.3rem;
  height: 0.3rem;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;


const CalendarModal = ({ isOpen, onClose }) => {
    
    const today = new Date();
    const [date, setDate] = useState(today);
    const attendDay = ["2023-12-03", "2023-12-13"]; // 출석한 날짜 예시
    
    const handleDateChange = (newDate) => {
      setDate(newDate);
    };

    // const [currentState, setCurrentState] = useState({
    //     isWater: {},
    //     satisfaction: {}
    // });

    // const params = JSON.stringify({
    //     "year": today.getFullYear(),
    //     "month": today.getMonth() + 1
    // });

    // useEffect(() => {
    //     if (!isOpen) {
    //         return;
    //     }

    //     const serviceURL = "luna://com.team17.homegardening.service/calendar";

    //     bridge.onservicecallback = function (msg) {
    //     const response = JSON.parse(msg);
    //     if (response.success) {
    //         setCurrentState({
    //             isWater: response.isWater,
    //             satisfaction: response.satisfaction
    //         });
    //         }
    //     };

    //     bridge.call(serviceURL, params);
    //     }, [isOpen, today]);


    if (!isOpen) {
        return null;
    }

    return (
        <ModalBackdrop onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <ThemeProvider theme={theme}>
                    <StyledCalendarWrapper>
                        <StyledCalendar
                            value={date}
                            onChange={handleDateChange}
                            locale="ko"
                            formatDay={(locale, date) => moment(date).format("D")}
                            formatYear={(locale, date) => moment(date).format("YYYY")}
                            formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
                            calendarType="gregory"
                            showNeighboringMonth={false}
                            next2Label={null}
                            prev2Label={null}
                            minDetail="year"

                            // 오늘 날짜에 '오늘' 텍스트 삽입하고 출석한 날짜에 점 표시를 위한 설정
                            tileContent={({ date, view }) => {
                                let html = [];
                                if (
                                view === "month" &&
                                date.getMonth() === today.getMonth() &&
                                date.getDate() === today.getDate()
                                ) {
                                html.push(<StyledToday key={"today"}>오늘</StyledToday>);
                                }
                                if (
                                attendDay.find((x) => x === moment(date).format("YYYY-MM-DD"))
                                ) {
                                html.push(<StyledDot key={moment(date).format("YYYY-MM-DD")} />);
                                }
                                return <>{html}</>;
                            }}
                            />
                    </StyledCalendarWrapper>
                </ThemeProvider>
            </div>
        </ModalBackdrop>
  );
};

export default CalendarModal;
