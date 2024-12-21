import './App.css';
import TransactionList from "./components/TransactionList"
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import AddItem from './components/AddItem';
import { Spin, Typography } from 'antd';
import axios from 'axios'
import EditItem from './components/EditItem';
import GoalsBox from './components/GoalsBox';
import Cookies from 'js-cookie';
import { Button } from 'antd';

const URL_TXACTIONS = '/api/txactions'

function FinanceScreen() {
  const [summaryAmount, setSummaryAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [transactionData, setTransactionData] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [item, setItem] = useState(null)

  const token = Cookies.get('userToken');
  if (!token) {
    window.location.href = '/login';
  }

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(URL_TXACTIONS)
      setTransactionData(response.data.data.map(row => ({
        id: row.id,
        key: row.id,
        ...row.attributes
      })))
    } catch (err) {
      console.log(err)
    } finally { setIsLoading(false) }
  }

  const handleAddItem = async (item) => {
    try {
      setIsLoading(true)
      const params = { ...item, action_datetime: dayjs() }
      const response = await axios.post(URL_TXACTIONS, { data: params })
      const { id, attributes } = response.data.data;
      setTransactionData([
        ...transactionData,
        { id: id, key: id, ...attributes }
      ]);
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNoteChanged = (id, note) => {
    setTransactionData(
      transactionData.map(transaction => {
        transaction.note = transaction.id === id ? note : transaction.note;
        return transaction
      })
    )
  }

  const handleRowDeleted = async (id) => {
    try {
      setIsLoading(true)
      await axios.delete(`${URL_TXACTIONS}/${id}`)
      fetchItems()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditItem = (record) => {
    setItem(record)
    setEditItem(record);
  };

  const closeEditModal = () => {
    setEditItem(null);
  };

  const updateItem = async (itemData) => {
    try {
      setIsLoading(true);
      await axios.put(`${URL_TXACTIONS}/${item.id}`, { data: itemData });
      setItem(null)
      fetchItems();
      setEditItem(null);
    } catch (err) {
      console.log("Error updating item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('userToken');
    window.location.href = '/login';
  };


  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    setSummaryAmount(transactionData.reduce(
      (sum, transaction) => (
        transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount
      ), 0)
    )
  }, [transactionData])


  return (
    <div className="App">
      <header className="App-header">
        <Spin spinning={isLoading}>
          <Typography.Title>
            ยอดเงินปัจจุบัน {summaryAmount} บาท
          </Typography.Title>
          <GoalsBox summaryAmount={summaryAmount} />

          <AddItem onItemAdded={handleAddItem} />
          <Divider>บันทึกรายรับ - รายจ่าย</Divider>
          <TransactionList
            data={transactionData}
            onNoteChanged={handleNoteChanged}
            onRowDeleted={handleRowDeleted}
            onEdit={handleEditItem}
          />
          <EditItem
            isOpen={editItem !== null}
            item={editItem}
            onItemEdited={updateItem}
            onCancel={closeEditModal}
          />
          <Button type="primary" onClick={handleLogout} style={{ marginBottom: '20px' }}>
            Logout
          </Button>
        </Spin>
      </header>
    </div>
  );
}

export default FinanceScreen;