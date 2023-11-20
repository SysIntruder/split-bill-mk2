import React from 'react'
import {
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Divider,
  FormInstance
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SyncOutlined
} from '@ant-design/icons'
import './App.css'

type ItemType = {
  name: number,
  price: number,
  discount: number,
  discountedPrice: number,
  roundedPrice: number,
}
type ItemsType = {
  items: ItemType[],
  finalPrice: number
}

let DISCOUNT_PERCENTAGE = 0
let TOTAL_PRICE = 0
const PERCENT_MODIFIER = 100
const DECIMAL_MODIFIER = 100

const roundNearestTenth = (num: number) => {
  return Math.round(num * DECIMAL_MODIFIER) / DECIMAL_MODIFIER
}
const calculateDiscountPercentage = (finalPrice: number, totalPrice: number) => {
  return roundNearestTenth(finalPrice / (totalPrice / PERCENT_MODIFIER))
}
const calculateDiscountedPrice = (discountPercentage: number, price: number) => {
  return roundNearestTenth((discountPercentage / DECIMAL_MODIFIER * price))
}
const roundDiscountedPrice = (discountedPrice: number) => {
  return Math.round(discountedPrice / DECIMAL_MODIFIER) * DECIMAL_MODIFIER
}
const calculateSplitBill = (form: ItemsType, formInstance: FormInstance): void => {
  TOTAL_PRICE = form.items.reduce((a, c) => Number(c.price) + a, 0)
  DISCOUNT_PERCENTAGE = calculateDiscountPercentage(form.finalPrice, TOTAL_PRICE)

  for (let i = 0; i < form.items.length; i++) {
    form.items[i].price = Number(form.items[i].price)
    form.items[i].discountedPrice = calculateDiscountedPrice(DISCOUNT_PERCENTAGE, form.items[i].price)
    form.items[i].roundedPrice = roundDiscountedPrice(form.items[i].discountedPrice)
    form.items[i].discount = form.items[i].price - form.items[i].roundedPrice
  }

  formInstance.setFieldsValue(form)
}

const TitleBar: React.FC = () => {
  const { Title } = Typography
  
  return (
    <>
      <Title level={2} style={{ marginTop: '0' }}>Split Bill MK 2</Title>
    </>
  )
}

const Header: React.FC = () => {
  const { Text } = Typography

  return (
    <Row gutter={16} style={{ padding: '.5rem 0' }}>
      <Col span={3} />
      <Col span={5}>
        <Text strong>Item</Text>
        <Text type='danger' strong> *</Text>
      </Col>
      <Col span={4}>
        <Text strong>Price</Text>
        <Text type='danger' strong> *</Text>
      </Col>
      <Col span={4}>
        <Text strong>Discount</Text>
      </Col>
      <Col span={4}>
        <Text strong>Discounted Price</Text>
      </Col>
      <Col span={4}>
        <Text strong>Rounded Price</Text>
      </Col>
    </Row>
  )
}

const Items: React.FC = () => {
  const { Text } = Typography
  const [form] = Form.useForm()
  const [, updateState] = React.useState({});
  const forceUpdate = React.useCallback(() => updateState({}), []);

  return (
    <>
      <Form
        form={form}
        name='basic'
        onFinish={(v) => {
          calculateSplitBill(v, form)
          forceUpdate()
        }}
      >
        <Form.List name='items'>
          {(fields, { add, remove }) => (
            <>
              <Form.Item style={{ margin: '1rem 0' }}>
                <Button
                  block
                  size='large'
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                >
                  Add Row
                </Button>
              </Form.Item>
              <Header />
              {fields.map(({ key, name, ...restField }) => (
                  <>
                    <Row key={key} gutter={16} style={{ margin: '1rem 0' }}>
                      <Col span={3}>
                        <Button
                          danger
                          type='primary'
                          size='large'
                          block
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        >
                          Delete Row
                        </Button>
                      </Col>
                      <Col span={5}>
                        <Form.Item {...restField} name={[name, 'name']}>
                          <Input placeholder='Item Name' size='large' />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item {...restField} name={[name, 'price']}>
                          <Input placeholder='Price' size='large' />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item {...restField} name={[name, 'discount']} shouldUpdate>
                          <Input readOnly placeholder='Discount' size='large' />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item {...restField} name={[name, 'discountedPrice']} shouldUpdate>
                          <Input readOnly placeholder='Discounted Price' size='large' />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item {...restField} name={[name, 'roundedPrice']} shouldUpdate>
                          <Input readOnly placeholder='Rounded Price' size='large' />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
              ))}
            </>
          )}
        </Form.List>

        <Divider />

        <Row gutter={16} style={{ margin: '1rem 0' }}>
          <Col span={3}>
            <Form.Item>
              <Text strong>&nbsp;</Text>
              <Button
                type='primary'
                size='large'
                block
                icon={<SyncOutlined />}
                htmlType='submit'
              >
                Calculate
              </Button>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Text strong>Final Price</Text>
            <Text type='danger' strong> *</Text>
            <Form.Item<ItemsType> name='finalPrice'>
              <Input placeholder='Final Price' size='large' />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Text strong>Total Price</Text>
            <Input value={TOTAL_PRICE} size='large' />
          </Col>
          <Col span={4}>
            <Text strong>Discount Percentage</Text>
            <Input value={DISCOUNT_PERCENTAGE} size='large' />
          </Col>
          <Col span={6} />
        </Row>
      </Form>
    </>
  )
}

const App: React.FC = () => {
  return (
    <>
      <TitleBar />
      <Items />
    </>
  )
}

export default App

