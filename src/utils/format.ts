import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc' // nodejs
// import utc from 'dayjs/plugin/utc' // ES 2015

dayjs.extend(utc)
export function formatUTC(utcString: string,format:string='YYYY-MM-DD HH:mm:ss') {
    return dayjs.utc(utcString).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
}