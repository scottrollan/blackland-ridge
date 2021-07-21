import React from 'react';
import { Form } from 'react-bootstrap';

const StreetAddress = ({ address, onChange }) => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}
    >
      <Form.Group controlId="streetAddress">
        <Form.Label>
          Street Address{'  '}
          <span style={{ color: 'var(--google-red', fontSize: 'small' }}>
            required
          </span>
        </Form.Label>
        <Form.Control
          as="select"
          required
          style={{ marginBottom: '1.2rem' }}
          onChange={(e) => onChange(e)}
          placeholder={address}
        >
          <option>{address ? address : 'Select Your Address'}</option>
          <option>4160 Blackland Drive</option>
          <option>4161 Blackland Drive</option>
          <option>4170 Blackland Drive</option>
          <option>4171 Blackland Drive</option>
          <option>4180 Blackland Drive</option>
          <option>4181 Blackland Drive</option>
          <option>4191 Blackland Drive</option>
          <option>4200 Blackland Drive</option>
          <option>4201 Blackland Drive</option>
          <option>4210 Blackland Drive</option>
          <option>4211 Blackland Drive</option>
          <option>4223 Blackland Drive</option>
          <option>4230 Blackland Drive</option>
          <option>4235 Blackland Drive</option>
          <option>4240 Blackland Drive</option>
          <option>4243 Blackland Drive</option>
          <option>4250 Blackland Drive</option>
          <option>4251 Blackland Drive</option>
          <option>4259 Blackland Drive</option>
          <option>4267 Blackland Drive</option>
          <option>4270 Blackland Drive</option>
          <option>4275 Blackland Drive</option>
          <option>4280 Blackland Drive</option>
          <option>4283 Blackland Drive</option>
          <option>4300 Blackland Drive</option>
          <option>4307 Blackland Drive</option>
          <option>4309 Blackland Drive</option>
          <option>4260 Blackland Way</option>
          <option>4261 Blackland Way</option>
          <option>4272 Blackland Way</option>
          <option>4273 Blackland Way</option>
          <option>4285 Blackland Way</option>
          <option>4297 Blackland Way</option>
          <option>4309 Blackland Way</option>
          <option>4310 Blackland Way</option>
          <option>4321 Blackland Way</option>
          <option>4330 Blackland Way</option>
          <option>4333 Blackland Way</option>
          <option>4345 Blackland Way</option>
          <option>89 Lakeshore Circle NE</option>
          <option>94 Lakeshore Circle NE</option>
          <option>95 Lakeshore Circle NE</option>
          <option>104 Lakeshore Circle NE</option>
          <option>105 Lakeshore Circle NE</option>
          <option>114 Lakeshore Circle NE</option>
          <option>4 Lakeshore Dr NE</option>
          <option>8 Lakeshore Dr NE</option>
          <option>12 Lakeshore Dr NE</option>
          <option>22 Lakeshore Dr NE</option>
          <option>32 Lakeshore Dr NE</option>
          <option>33 Lakeshore Dr NE</option>
          <option>42 Lakeshore Dr NE</option>
          <option>43 Lakeshore Dr NE</option>
          <option>52 Lakeshore Dr NE</option>
          <option>53 Lakeshore Dr NE</option>
          <option>62 Lakeshore Dr NE</option>
          <option>67 Lakeshore Dr NE</option>
          <option>72 Lakeshore Dr NE</option>
          <option>82 Lakeshore Dr NE</option>
          <option>83 Lakeshore Dr NE</option>
          <option>85 Lakeshore Dr NE</option>
          <option>92 Lakeshore Dr NE</option>
          <option>103 Lakeshore Dr NE</option>
          <option>112 Lakeshore Dr NE</option>
          <option>122 Lakeshore Dr NE</option>
          <option>123 Lakeshore Dr NE</option>
          <option>132 Lakeshore Dr NE</option>
          <option>133 Lakeshore Dr NE</option>
          <option>3725 Lakeshore Dr NE</option>
          <option>3744 Lakeshore Dr NE</option>
          <option>3745 Lakeshore Dr NE</option>
          <option>3765 Lakeshore Dr NE</option>
          <option>3776 Lakeshore Dr NE</option>
          <option>3785 Lakeshore Dr NE</option>
          <option>3804 Lakeshore Dr NE</option>
          <option>3805 Lakeshore Dr NE</option>
          <option>3825 Lakeshore Dr NE</option>
          <option>3845 Lakeshore Dr NE</option>
          <option>1 Old Fuller Mill Rd NE</option>
          <option>3 Old Fuller Mill Rd NE</option>
          <option>20 Old Fuller Mill Rd NE</option>
          <option>46 Old Fuller Mill Rd NE</option>
          <option>47 Old Fuller Mill Rd NE</option>
          <option>48 Old Fuller Mill Rd NE</option>
          <option>49 Old Fuller Mill Rd NE</option>
          <option>50 Old Fuller Mill Rd NE</option>
          <option>51 Old Fuller Mill Rd NE</option>
          <option>52 Old Fuller Mill Rd NE</option>
          <option>53 Old Fuller Mill Rd NE</option>
          <option>54 Old Fuller Mill Rd NE</option>
          <option>55 Old Fuller Mill Rd NE</option>
          <option>56 Old Fuller Mill Rd NE</option>
          <option>57 Old Fuller Mill Rd NE</option>
          <option>58 Old Fuller Mill Rd NE</option>
          <option>59 Old Fuller Mill Rd NE</option>
          <option>60 Old Fuller Mill Rd NE</option>
          <option>61 Old Fuller Mill Rd NE</option>
          <option>62 Old Fuller Mill Rd NE</option>
          <option>63 Old Fuller Mill Rd NE</option>
          <option>64 Old Fuller Mill Rd NE</option>
          <option>66 Old Fuller Mill Rd NE</option>
          <option>22 Old Stonemill Rd NE</option>
          <option>23 Old Stonemill Rd NE</option>
          <option>32 Old Stonemill Rd NE</option>
          <option>33 Old Stonemill Rd NE</option>
          <option>42 Old Stonemill Rd NE</option>
          <option>43 Old Stonemill Rd NE</option>
          <option>52 Old Stonemill Rd NE</option>
          <option>53 Old Stonemill Rd NE</option>
          <option>62 Old Stonemill Rd NE</option>
          <option>63 Old Stonemill Rd NE</option>
          <option>72 Old Stonemill Rd NE</option>
          <option>73 Old Stonemill Rd NE</option>
          <option>76 Old Stonemill Rd NE</option>
          <option>79 Old Stonemill Rd NE</option>
          <option>80 Old Stonemill Rd NE</option>
          <option>83 Old Stonemill Rd NE</option>
          <option>84 Old Stonemill Rd NE</option>
          <option>87 Old Stonemill Rd NE</option>
          <option>88 Old Stonemill Rd NE</option>
          <option>91 Old Stonemill Rd NE</option>
          <option>92 Old Stonemill Rd NE</option>
          <option>24 W Blackland Ct NE</option>
          <option>35 W Blackland Ct NE</option>
          <option>36 W Blackland Ct NE</option>
          <option>48 W Blackland Ct NE</option>
          <option>55 W Blackland Ct NE</option>
          <option>60 W Blackland Ct NE</option>
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default StreetAddress;
