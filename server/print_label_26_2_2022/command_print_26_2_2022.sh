product_number=${1}
mac=${2}
mac_in_qr_code=${3}
print_port=$4
last_mac_address_letters=$5
link_wed="wecheer.io/b/"
echo 'digital' | sudo -S echo "auto insert password"

hex_len_mac=$(echo "obase=16; ${#mac}" | bc)
hex_len_last_macaddress_letters=$(echo "obase=16; ${#last_mac_address_letters}" | bc)

len_qr_code=${#link_wed}+${#mac_in_qr_code}
hex_len_mac_in_qr_code=$(echo "obase=16; $len_qr_code" | bc) 

echo "len string mac = ${#mac} \t convert to hex = ${hex_len_mac}"; 
echo "len string mac_in_qr_code = ${#mac_in_qr_code}\t + len string link_wed = ${#link_wed} \t len string in hex of qr_code = ${hex_len_mac_in_qr_code}"

data="\x1B\x69\x61\x33" # switch to template print mode 
data="${data}\x5E\x49\x49" # initialize

data="${data}\x5E\x54\x53\x30\x30\x31" # choose templete1

data="${data}\x5E\x4F\x4E\x31\x00"  # choose 1-QR CODE  object
data="${data}\x5E\x44\x49\x${hex_len_mac_in_qr_code}\x00" # directly insert text to print
qr_code="${link_wed}${mac_in_qr_code}"
data="${data}${qr_code}"


data="${data}\x5E\x4F\x4E\x34\x00"  # choose 4-last letter macaddress
data="${data}\x5E\x44\x49\x${hex_len_last_macaddress_letters}\x00" # directly insert text to print
data="${data}${last_mac_address_letters}"


data="${data}\x5E\x4F\x4E\x32\x00"  # choose 2-MAC object
data="${data}\x5E\x44\x49\x${hex_len_mac}\x00" # directly insert text to print
data="${data}${mac}"

str_p="${product_number}"
hex_str_p=$(echo "obase=16; ${#str_p}" | bc) 
echo "hex_str_p = ${hex_str_p}"
data="${data}\x5E\x4F\x4E\x33\x00"  # choose 3-product number  object
data="${data}\x5E\x44\x49\x${hex_str_p}\x00" # directly insert text to print
data="${data}${str_p}"
 
data="${data}\x5E\x46\x46"  # start print 


sudo echo -ne $data > $print_port
